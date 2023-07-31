# Tip service
Service for sending tips in cryptocurrency. The project consists of 4 parts - smart contracts, backend, relayer and frontend.
___
### Smart contracts
Railgun smart contracts are currently being used. Later they can be replaced by their modified version if needed. (Solidity)
___
### Relayer
The relayer is responsible for sending generated transactions to the network. Its use allows gas-free transactions, which simplifies the interaction with the system for users. (Node.js)
#### Commands
```bash
npm start
```
___

### Backend
The backend is responsible for storing public information about users and establishments. So far, a simple API has been implemented, with the possibility of further expansion. (Django/Django Rest Framework)
#### Commands
```bash
docker compose up
```
___
### Frontend
The frontend is the link between all the components and is responsible for storing private information (such as keys). The current implementation provides a simplified functionality. Now these are standard html components without layout. (React)
#### Commands
```bash
yarn start
```
___