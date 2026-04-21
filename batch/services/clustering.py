# services/clustering.py

import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

def apply_strategic_cluster(df_pos, n_clusters=4):

    df_hotel = df_pos.groupby('hotel_id').agg({
        'market_fit': 'mean',
        'responsiveness': 'mean',
        'structural': 'mean',
        'strategy': 'mean'
    }).reset_index()

    df_hotel['r_clipped'] = df_hotel['responsiveness'].clip(lower=-0.05, upper=0.15)
    
    features = ['market_fit', 'r_clipped', 'structural', 'strategy']
    X = df_hotel[features]
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    X_scaled[:, 2] *= 2.5
    X_scaled[:, 1] *= 1.2
    X_scaled[:, 0] *= 0.8

    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    df_hotel['cluster_id'] = kmeans.fit_predict(X_scaled)
    
    return df_hotel