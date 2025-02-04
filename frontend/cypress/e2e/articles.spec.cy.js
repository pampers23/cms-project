// articles.spec.cy.js

// --------------------
// Home Page Test Suite
// --------------------
describe('The Home Page', () => {
  it('successfully loads and shows the article container', () => {
    // Visit the homepage
    cy.visit('http://localhost:5173/');

    // Check that the element with class "hero-section" exists and is visible.
    cy.get('.hero-section', { timeout: 10000 }).should('be.visible');
  });

  it('navigates to the Articles page when "Get Started" is clicked', () => {
    // Visit the homepage
    cy.visit('http://localhost:5173/');

    // Click the "Get Started" button
    cy.get('.cta-button').click();

    // Verify that the URL includes '/articles'
    cy.url().should('include', '/articles');

    // Check that the Articles page content is visible
    cy.get('.article-container', { timeout: 10000 }).should('be.visible');
  });
});

// -------------------------
// Articles Page Test Suite
// -------------------------
describe('Articles Page', () => {
  beforeEach(() => {
    // Register the intercept for the GET request.
    // Use a glob pattern to match any extra URL parts (like query parameters)
    cy.intercept('GET', '**/items/Articles*', {
      statusCode: 200,
      body: {
        data: [
          { id: 1, title: 'First Article', Content: 'Content for first article', Slug: 'first-article' },
          { id: 2, title: 'Second Article', Content: 'Content for second article', Slug: 'second-article' }
        ]
      }
    }).as('getArticles');

    // Visit the Articles page directly
    cy.visit('http://localhost:5173/articles');

    // Wait for the GET request to complete.
    cy.wait('@getArticles');
    cy.contains('Create New Article').should('be.visible');
  });

  it('creates a new article', () => {
    // Intercept the POST request for creating a new article.
    cy.intercept('POST', '**/items/Articles*', (req) => {
      req.reply({
        statusCode: 201,
        body: { data: { id: 3, ...req.body } }
      });
    }).as('postArticle');

    // After creating the article, intercept the GET request again to return an updated list.
    cy.intercept('GET', '**/items/Articles*', {
      statusCode: 200,
      body: {
        data: [
          { id: 1, title: 'First Article', Content: 'Content for first article', Slug: 'first-article' },
          { id: 2, title: 'Second Article', Content: 'Content for second article', Slug: 'second-article' },
          { id: 3, title: 'New Article', Content: 'New article content', Slug: 'new-article' }
        ]
      }
    }).as('getArticlesAfterPost');

    // Fill out the form for a new article.
    cy.get('input[placeholder="Slug"]').type('new-article');
    cy.get('textarea[placeholder="Content"]').type('New article content');
    cy.get('[data-testid="create-button"]').click();

    // Wait for the POST and subsequent GET calls to complete.
    cy.wait('@postArticle');
    cy.wait('@getArticlesAfterPost');

    // Verify the article list now contains 3 items and that the new article appears.
    cy.get('[data-testid="article-list-item"]').should('have.length', 3);
    cy.contains('New Article').should('exist');
  });
});

// ---------------------------
// Article View Page Test Suite
// ---------------------------
describe('Article View Page', () => {
  const articleId = 1;

  beforeEach(() => {
    // Intercept the GET request for the specific article.
    cy.intercept('GET', `**/items/Articles/${articleId}*`, {
      statusCode: 200,
      body: {
        data: {
          id: articleId,
          title: 'Test Article',
          Content: '<p>Test content</p>',
          Slug: 'test-article'
        }
      }
    }).as('getArticle');

    // Visit the article view page.
    cy.visit(`http://localhost:5173/article/${articleId}`);
    cy.wait('@getArticle');
  });

  it('displays article details', () => {
    // Assert that the article details are rendered.
    cy.contains('Test Article').should('be.visible');
    cy.contains('Slug:').should('be.visible');
    cy.contains('test-article').should('be.visible');
    cy.contains('Test content').should('be.visible');
  });
});
