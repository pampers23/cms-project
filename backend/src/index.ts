import { serve } from '@hono/node-server';
import multer from 'multer';
import { Hono } from 'hono';
import path from 'path';
import { createDirectus, rest, readItems, createItem, updateItem, deleteItem } from '@directus/sdk';
;
// Initialize Directus client
const client = createDirectus('http://localhost:8055/').with(rest());

// Initialize Hono app
const app = new Hono();

// Route to get all articles
app.get('/items/Articles', async (c) => {
  try {
    const articles = await client.request(readItems('Articles'));
    return c.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return c.json({ error: 'Error fetching articles' }, 500);
  }
});

// Route to get a specific article by ID
app.get('/items/Articles/:id', async (c) => {
  console.log('Route handler called');
  const id = c.req.param('id');
  console.log(`Updating article with ID: ${id}`);
  try {
    const articles = await client.request(
      readItems('Articles', { filter: { id: { _eq: id } } })
    );
    if (articles.length === 0) {
      return c.json({ error: 'Article not found' }, 404);
    }
    return c.json(articles[0]);
  } catch (error) {
    console.error('Error fetching article by ID:', error);
    return c.json({ error: 'An unknown error occurred' }, 500);
  }
});


// Route to create a new article
app.post('/items/Articles', async (c) => {
  console.log('📌 Route Hit: /item/Articles');

  try {
    const newArticle = await c.req.parseBody();
    console.log('🔹 Parsed Body:', newArticle);
    const { title, slug, content } = newArticle;
    console.log(`📝 Title: ${title}`);
    console.log(`🔗 Slug: ${slug}`);
    console.log(`📜 Content: ${content}`);

    return c.json({ message: "Body Test", newArticle });
  } catch (error) {
    console.error('❌ Error parsing body:', error);
    return c.json({ error: "Error parsing body" }, 500);
  }
});


// Route to update an existing article
app.patch('/items/Articles/:id', async (c) => {
  const { id } = c.req.param();
  console.log('Received request for ID:', id);
  
  const updatedData = await c.req.json();
  console.log('Updated data:', updatedData);
  
  try {
    const updatedArticle = await client.request(updateItem('Articles', id, updatedData));
    return c.json(updatedArticle);
  } catch (error) {
    console.error('Error updating article:', error);
    return c.json({ error: 'Error updating article' }, 500);
  }
});


// Route to delete an article
app.delete('/item/Articles/:id', async (c) => {
  const { id } = c.req.param();
  try {
    await client.request(deleteItem('Articles', id));
    return c.status(204);
  } catch (error) {
    console.error('Error deleting article:', error);
    return c.json({ error: 'Error deleting article' }, 500);
  }
});


// Start the server
const port = 5000;
console.log(`Server is running on http://localhost:${port}`);
serve({
  fetch: app.fetch,
  port,
});