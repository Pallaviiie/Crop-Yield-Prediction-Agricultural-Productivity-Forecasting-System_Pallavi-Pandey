FROM python:3.13-slim

WORKDIR /app

COPY requirements-docker.txt requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY datasets ./datasets

# Train the ML model during Docker image build
RUN python -m app.ml.train_model

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]