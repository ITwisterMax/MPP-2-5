import {createClient} from 'graphql-ws'

const client = createClient({url: 'ws://localhost:3001/graphql'});

export default client;