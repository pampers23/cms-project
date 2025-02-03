import { createDirectus, rest } from '@directus/sdk';

const client = createDirectus('http://localhost:8055/').with(rest());

export default client;