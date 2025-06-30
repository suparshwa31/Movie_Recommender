
"""# **Colaborative Filtering**

We are using a predefined used id for this remmender.
i.e. the ratings_small.csv file which contains ratings for movies for each user.
"""

from surprise import Reader, Dataset, SVD
from surprise.model_selection import cross_validate
from surprise import accuracy
import pandas as pd
import numpy as np


reader = Reader()
ratings = pd.read_csv('dataset/ratings_small.csv')
ratings.head()

data = Dataset.load_from_df(ratings[['userId', 'movieId', 'rating']], reader)

algo = SVD()
cross_validate(algo, data, measures=['RMSE', 'MAE'], cv=5, verbose=True)

trainset = data.build_full_trainset()
algo.fit(trainset)

ratings[ratings['userId'] == 1]

algo.predict(1, 302, 3)