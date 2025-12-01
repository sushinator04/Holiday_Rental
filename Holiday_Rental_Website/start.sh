set -e

cd backend
pip3 install .
python -m server.router.app &

cd ..

cd frontend
npm i
npm run dev
