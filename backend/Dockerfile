FROM python:3.9-slim
WORKDIR /backend
COPY . .
RUN pip3 install .
EXPOSE 8080
CMD ["start-server", "--host", "0.0.0.0"]