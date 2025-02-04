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
    // Intercept the GET request BEFORE visiting the page
    cy.intercept('GET', '**/items/Articles*', (req) => {
      req.continue((res) => {
        console.log('Intercepted GET Response:', res.body); // Debugging
      });
    }).as('getArticles');

    // Visit the Articles page
    cy.visit('http://localhost:5173/articles');

    // Wait for the GET request to complete
    cy.wait('@getArticles');
    cy.contains('Create New Article').should('be.visible');
  });

  it('creates a new article', () => {
    // Register the POST intercept first
    cy.intercept('POST', '**/items/Articles*', (req) => {
      console.log('Intercepted POST Request:', req.body); // Debugging
      req.reply({
        statusCode: 201,
        body: { data: { id: 3, ...req.body } },
      });
    }).as('postArticle');

    // Intercept the updated GET request AFTER posting
    cy.intercept('GET', '**/items/Articles*', (req) => {
      req.continue((res) => {
        console.log('Intercepted GET After POST:', res.body); // Debugging
      });
    }).as('getArticlesAfterPost');

    // Fill out the form for a new article.
    cy.get('input[placeholder="Slug"]').type('new-article');
    cy.get('textarea[placeholder="Content"]').type('New article content');
    cy.get('[data-testid="create-button"]').click();

    // Wait for the POST request to complete
    cy.wait('@postArticle', { timeout: 10000 }); // Extended timeout

    // Wait for the GET request to refresh the list
    cy.wait('@getArticlesAfterPost');

    // Verify the article list now contains 3 items
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
    // Intercept the GET request BEFORE visiting the page
    cy.intercept('GET', `**/items/Articles/${articleId}*`, (req) => {
      req.continue((res) => {
        console.log('Intercepted GET Article Response:', res.body); // Debugging
      });
    }).as('getArticle');

    // Visit the article view page
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
