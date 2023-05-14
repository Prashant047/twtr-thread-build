import tensorflow as tf
from tensorflow.keras import layers, Model
from tensorflow.keras.optimizers import Adam
from sklearn.preprocessing import OneHotEncoder, LabelEncoder
import numpy as np
import pandas as pd

# Load the dataset (assuming it's a CSV file)
# data = pd.read_csv("dataset.csv")

# Preprocess text data
def preprocess_text(text_column):
    return text_column.apply(lambda x: x.lower())

data['title'] = preprocess_text(data['title'])
data['description'] = preprocess_text(data['description'])
data['tags'] = preprocess_text(data['tags'])

# Tokenize text data
tokenizer = tf.keras.preprocessing.text.Tokenizer()
tokenizer.fit_on_texts(pd.concat([data['title'], data['description'], data['tags']]))
MAX_LEN = 128
title_sequences = tokenizer.texts_to_sequences(data['title'])
desc_sequences = tokenizer.texts_to_sequences(data['description'])
tags_sequences = tokenizer.texts_to_sequences(data['tags'])

title_input = tf.keras.preprocessing.sequence.pad_sequences(title_sequences, maxlen=MAX_LEN)
desc_input = tf.keras.preprocessing.sequence.pad_sequences(desc_sequences, maxlen=MAX_LEN)
tags_input = tf.keras.preprocessing.sequence.pad_sequences(tags_sequences, maxlen=MAX_LEN)

# One-hot encode categorical features
categorical_features = ['type', 'room', 'craft_type', 'recipient', 'material', 'occasion', 'holiday', 'art_subject', 'style', 'shape', 'pattern']
cat_data = data[categorical_features]
one_hot_encoder = OneHotEncoder()
cat_data_one_hot = one_hot_encoder.fit_transform(cat_data).toarray()

# Split data into training and validation sets
train_indices = np.random.rand(len(data)) < 0.8
X_train_text = [title_input[train_indices], desc_input[train_indices], tags_input[train_indices]]
X_val_text = [title_input[~train_indices], desc_input[~train_indices], tags_input[~train_indices]]
X_train_cat = cat_data_one_hot[train_indices]
X_val_cat = cat_data_one_hot[~train_indices]

# Encode labels
label_encoders = {}
for col in ['top_category_id', 'bottom_category_id']:
    label_encoders[col] = LabelEncoder()
    data[col] = label_encoders[col].fit_transform(data[col])

y_train = [data.loc[train_indices, 'top_category_id'].values, data.loc[train_indices, 'bottom_category_id'].values]
y_val = [data.loc[~train_indices, 'top_category_id'].values, data.loc[~train_indices, 'bottom_category_id'].values]

# Build the model
def create_model():
    text_inputs = [layers.Input(shape=(MAX_LEN, ), dtype=tf.int32) for _ in range(3)]
    cat_input = layers.Input(shape=(cat_data_one_hot.shape[1],), dtype=tf.float32)
    
    bert_layer = tf.keras.models.load_model('bert-base-uncased')
    
    text_embeddings = [bert_layer(text_input) for text_input in text_inputs]
    text_concat = layers.Concatenate(axis=1)(text_embeddings)
    
    merged_inputs = layers.Concatenate(axis=1)([text_concat, cat_input])
    x = layers.Dense(128, activation='relu')(merged_inputs)
    x = layers.BatchNormalization()(x)
    x = layers.Dropout(0.5)(x)
    
    top_category_output = layers.Dense(len(label_encoders['top_category_id'].classes_), activation='softmax', name='top_category')(x)
    bottom_category_output = layers.Dense(len(label_encoders['bottom_category_id'].classes_), activation='softmax', name='bottom_category')(x)

    model = Model(inputs=[*text_inputs, cat_input], outputs=[top_category_output, bottom_category_output])
    return model

model = create_model()

# Compile and train the model
model.compile(optimizer=Adam(learning_rate=1e-5),
              loss={'top_category': 'sparse_categorical_crossentropy', 'bottom_category': 'sparse_categorical_crossentropy'},
              metrics={'top_category': 'accuracy', 'bottom_category': 'accuracy'})

history = model.fit([*X_train_text, X_train_cat], {'top_category': y_train[0], 'bottom_category': y_train[1]},
                    validation_data=([*X_val_text, X_val_cat], {'top_category': y_val[0], 'bottom_category': y_val[1]}),
                    batch_size=32, epochs=10)

# Evaluate the model
val_loss, val_top_category_loss, val_bottom_category_loss, val_top_category_acc, val_bottom_category_acc = model.evaluate([*X_val_text, X_val_cat], {'top_category': y_val[0], 'bottom_category': y_val[1]})

print("Top Category Validation Accuracy: ", val_top_category_acc)
print("Bottom Category Validation Accuracy: ", val_bottom_category_acc) 