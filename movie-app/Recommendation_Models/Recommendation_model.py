from flask import Flask, jsonify, request
import pandas as pd
import numpy as np
from ast import literal_eval
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.metrics.pairwise import linear_kernel, cosine_similarity
from surprise import Reader, Dataset, SVD
from surprise.model_selection import train_test_split

app = Flask(__name__)

# Load Data
df1 = pd.read_csv('dataset/tmdb_5000_credits.csv')
df2 = pd.read_csv('dataset/tmdb_5000_movies.csv')
df1.columns = ['id', 'title', 'cast', 'crew']
df2 = df2.merge(df1, on='id')

# ---------- DEMOGRAPHIC FILTERING ----------
vote_mean = df2['vote_average'].mean()
min_votes = df2['vote_count'].quantile(0.9)

def weighted_rating(x, m=min_votes, C=vote_mean):
    v = x['vote_count']
    R = x['vote_average']
    return (v/(v+m) * R) + (m/(m+v) * C)

df2['score'] = df2.apply(weighted_rating, axis=1)
filtered_movies = df2[df2['vote_count'] >= min_votes].sort_values('score', ascending=False)

@app.route('/demographic', methods=['GET'])
def recommend_demographic():
    limit = int(request.args.get("limit", 10))
    top_movies = filtered_movies[['id', 'original_title', 'vote_count', 'vote_average', 'score']].head(limit)
    return jsonify(top_movies.to_dict(orient='records'))

# ---------- CONTENT-BASED FILTERING ----------
df2['overview'] = df2['overview'].fillna('')
tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(df2['overview'])
cosine_sim_overview = linear_kernel(tfidf_matrix, tfidf_matrix)

features = ['cast', 'crew', 'keywords', 'genres']
for feature in features:
    df2[feature] = df2[feature].apply(literal_eval)

def get_director(x):
    for i in x:
        if i['job'] == 'Director':
            return i['name']
    return ''

def get_list(x):
    if isinstance(x, list):
        return [i['name'] for i in x[:3]]
    return []

df2['director'] = df2['crew'].apply(get_director)
for feature in ['cast', 'keywords', 'genres']:
    df2[feature] = df2[feature].apply(get_list)

def clean_data(x):
    if isinstance(x, list):
        return [str.lower(i.replace(" ", "")) for i in x]
    elif isinstance(x, str):
        return str.lower(x.replace(" ", ""))
    else:
        return ''

for feature in ['cast', 'keywords', 'director', 'genres']:
    df2[feature] = df2[feature].apply(clean_data)

df2['soup'] = df2.apply(lambda x: ' '.join(x['keywords']) + ' ' + 
                        ' '.join(x['cast']) + ' ' + 
                        x['director'] + ' ' + 
                        ' '.join(x['genres']), axis=1)

count = CountVectorizer(stop_words='english')
count_matrix = count.fit_transform(df2['soup'])
cosine_sim_metadata = cosine_similarity(count_matrix, count_matrix)

df2 = df2.reset_index()
indices = pd.Series(df2.index, index=df2['original_title']).drop_duplicates()

def content_recommender(title, method='tfidf', top_n=10):
    if title not in indices:
        return []
    idx = indices[title]
    sim_matrix = cosine_sim_overview if method == 'tfidf' else cosine_sim_metadata
    sim_scores = list(enumerate(sim_matrix[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:top_n+1]
    movie_indices = [i[0] for i in sim_scores]
    return df2['original_title'].iloc[movie_indices].tolist()

@app.route('/content', methods=['GET'])
def recommend_content():
    title = request.args.get('title')
    method = request.args.get('method', 'tfidf')  # tfidf or metadata
    recommendations = content_recommender(title, method)
    return jsonify({'input': title, 'method': method, 'recommendations': recommendations})

# ---------- COLLABORATIVE FILTERING ----------
ratings = pd.read_csv('dataset/ratings_small.csv')
reader = Reader()
data = Dataset.load_from_df(ratings[['userId', 'movieId', 'rating']], reader)
trainset = data.build_full_trainset()
algo = SVD()
algo.fit(trainset)

@app.route('/collaborative', methods=['GET'])
def recommend_collaborative():
    user_id = int(request.args.get('user_id', 1))
    user_movies = ratings[ratings['userId'] == user_id]['movieId'].tolist()
    unique_movie_ids = ratings['movieId'].unique()

    not_rated = [i for i in unique_movie_ids if i not in user_movies][:10]

    predictions = [algo.predict(user_id, movie_id) for movie_id in not_rated]
    predictions.sort(key=lambda x: x.est, reverse=True)
    recommended_ids = [int(pred.iid) for pred in predictions]

    # Mapping TMDB IDs if necessary
    links = pd.read_csv('dataset/links_small.csv')
    movie_map = pd.read_csv('dataset/movies_metadata.csv', low_memory=False)
    links['tmdbId'] = links['tmdbId'].fillna(0).astype('int')
    movie_map = movie_map[movie_map['id'].apply(lambda x: str(x).isdigit())]
    movie_map['id'] = movie_map['id'].astype('int')
    merged = links.merge(movie_map, left_on='tmdbId', right_on='id')

    final = merged[merged['movieId'].isin(recommended_ids)][['title']].head(10)
    return jsonify(final['title'].tolist())

# ---------- Run Flask App ----------
if __name__ == '__main__':
    app.run(debug=True, port=5001)
