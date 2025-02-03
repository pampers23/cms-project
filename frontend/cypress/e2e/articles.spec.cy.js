describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.visit('http://localhost:5173/');

    it("To see the whole container", () => {
      cy.get("article-container");
    });
  })
});

describe('Articles Page', () => {
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:8055/items/Articles', {
      statusCode: 200,
      body: {
        data: [
          {
            id: 1,
            title: 'First Article',
            Content: 'Content for first article',
            Slug: 'first-article'
          },
          {
            id: 2,
            title: 'Second Article',
            Content: 'Content for second article',
            Slug: 'second-article'
          }
        ]
      }
    }).as('getArticles');

    cy.visit('http://localhost:5173/');
    cy.wait('@getArticles');
    
    // Ensure the form container is visible before interacting with it.
    cy.contains('Create New Article').should('be.visible');
  });

  it('creates a new article', () => {
    // Intercept the POST request for article creation.
    cy.intercept('POST', 'http://localhost:8055/items/Articles', (req) => {
      req.reply({
        statusCode: 201,
        body: { data: { id: 3, ...req.body } }
      });
    }).as('postArticle');

    // Intercept the GET request after article creation.
    cy.intercept('GET', 'http://localhost:8055/items/Articles', {
      statusCode: 200,
      body: {
        data: [
          {
            id: 1,
            title: 'First Article',
            Content: 'Content for first article',
            Slug: 'first-article'
          },
          {
            id: 2,
            title: 'Second Article',
            Content: 'Content for second article',
            Slug: 'second-article'
          },
          {
            id: 3,
            title: 'New Article',
            Content: 'New article content',
            Slug: 'new-article'
          }
        ]
      }
    }).as('getArticlesAfterPost');

    // Fill out the create article form.
    cy.get('input[placeholder="Slug"]').type('new-article');
    cy.get('textarea[placeholder="Content"]').type('New article content');
    cy.get('[data-testid="create-button"]').click();

    // Wait for the POST request and the refreshed GET call.
    cy.wait('@postArticle');
    cy.wait('@getArticlesAfterPost');

    // Confirm the new article appears in the list.
    cy.get('[data-testid="article-list-item"]').should('have.length', 3);
    cy.contains('New Article');
  });
});

// view update

describe('Article View Page', () => {
  const articleId = 1; // Adjust as needed

  beforeEach(() => {
    // Intercept GET request for article details.
    cy.intercept('GET', `http://localhost:8055/items/Articles/${articleId}`, {
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

    // Visit the Article View page.
    cy.visit(`http://localhost:5173/article/${articleId}`);
    cy.wait('@getArticle');
  });

  it('displays article details', () => {
    // Verify that the article details are displayed.
    cy.contains('Test Article');
    cy.contains('Slug:');
    cy.contains('test-article');
    cy.contains('Test content');
  });

// it('edits the article', () => {
//   // 1. Intercept with error handling
//   cy.intercept('PATCH', '/items/Articles/*', (req) => {
//     console.log('Intercepted PATCH request to:', req.url);
//     req.reply({
//       statusCode: 200,
//       body: { success: true },
//       headers: { 'Content-Type': 'application/json' }
//     });
//   }).as('patchArticle');

//   // 2. Visit with readiness check
//   cy.visit(`http://localhost:5173/article/${articleId}`);
//   cy.get('h1').should('exist'); // Wait for page load

//   // 3. Edit mode with visibility checks
//   cy.contains('Edit').should('be.visible').click();
//   cy.get('[data-cy="edit-form"]').should('be.visible');

//   // 4. Form interaction with forced updates
//   cy.get('input.article-form-input').first()
//     .clear({ force: true })
//     .type('Updated Article', { delay: 30, force: true });
  
//   cy.get('input.article-form-input').eq(1)
//     .clear({ force: true })
//     .type('updated-article', { delay: 30, force: true });

//   cy.get('textarea.article-form-textarea')
//     .clear({ force: true })
//     .type('Updated content', { delay: 30, force: true });

//   // 5. Add client-side delay
//   cy.wait(1000); // Let any debounce/validation complete

//   // 6. Click with network wait
//   cy.contains('Update')
//     .click()
//     .then(() => {
//       // 7. Verify network call
//       cy.wait('@patchArticle', { timeout: 15000 })
//         .then((interception) => {
//           // Verify request payload
//           expect(interception.request.body).to.include({
//             title: 'Updated Article',
//             slug: 'updated-article',
//             content: 'Updated content'
//           });
          
//           // Verify response
//           expect(interception.response.statusCode).to.eq(200);
//         });
//     });

//   // 8. Verify UI updates
//   cy.contains('h1', 'Updated Article').should('exist');
//   cy.contains('div.content', 'Updated content').should('exist');
// });

  // it('deletes the article and navigates back to the homepage', () => {
  //   // Intercept the DELETE request for the article.
  //   cy.intercept('DELETE', `http://localhost:8055/items/Articles/${articleId}`, {
  //     statusCode: 200,
  //     body: { data: {} }
  //   }).as('deleteArticle');

  //   // Click the Delete button.
  //   cy.contains('Delete').click();
  //   cy.wait('@deleteArticle');

  //   // Assert that the URL is now the homepage.
  //   cy.url().should('eq', 'http://localhost:5173/');
  // });
});
