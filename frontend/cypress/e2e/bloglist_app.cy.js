describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', Cypress.env('BACKEND') + '/testing/reset')

    cy.request('POST', Cypress.env('BACKEND') + '/users', {
      username: 'TestUser',
      name: 'Test User',
      password: 'TestPassword'
    })

    cy.visit('')
  })

  it('Login form is shown by default', function() {
    cy.contains('Login')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('input#usernameInput').type('TestUser')
      cy.get('input#passwordInput').type('TestPassword')
      cy.contains('Login').click()

      cy.contains('Test User logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('input#usernameInput').type('TestUser')
      cy.get('input#passwordInput').type('WrongPassword')
      cy.contains('Login').click()

      cy.contains('Wrong username or password')
      cy.get('Test User logged in').should('not.exist')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'TestUser', password: 'TestPassword' })
    })

    it('A blog can be created', function() {
      cy.contains('Test Title Test Author').should('not.exist')

      cy.contains('Create Blog').click()

      cy.get('input#titleInput').type('Test Title')
      cy.get('input#authorInput').type('Test Author')
      cy.get('input#urlInput').type('http://test.com')

      cy.contains(/^Create$/).click()

      cy.contains('Test Title Test Author')
      cy
        .request(Cypress.env('BACKEND') + '/blogs')
        .its('body')
        .should('have.length', 1)
        .and((blogs) => {
          expect(blogs[0]).to.deep.include({ title: 'Test Title', author: 'Test Author', url: 'http://test.com' })
        })
    })

    describe('and a blog exists', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'Test Title', author: 'Test Author', url: 'http://test.com' })
      })

      it('it can be liked', function() {
        cy.contains('0 likes')

        cy.contains('Show').click()
        cy.contains('Like').click()

        cy.contains('1 likes')
        cy
          .request(Cypress.env('BACKEND') + '/blogs')
          .its('body')
          .should((blogs) => expect(blogs[0].likes).to.equal(1))
      })

      it('it can be removed by the user who created it', function() {
        cy.contains('Show').click()
        cy.contains('Remove').click()

        cy.contains('Added by Test User').should('not.exist')
        cy
          .request(Cypress.env('BACKEND') + '/blogs')
          .its('body')
          .should('have.length', 0)
      })

      it('its remove button does not show for other users', function() {
        cy.contains('Logout').click()

        cy.request('POST', Cypress.env('BACKEND') + '/users', {
          username: 'OtherUser',
          name: 'Other User',
          password: 'OtherPassword'
        })

        cy.login({ username: 'OtherUser', password: 'OtherPassword' })

        cy.contains('Show').click()
        cy.get('Remove').should('not.exist')
      })
    })

    describe('and multiple blogs exist', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'Test Title', author: 'Test Author', url: 'http://test.com' })
        cy.createBlog({ title: 'Test Title 2', author: 'Test Author 2', url: 'http://test2.com' })
        cy.createBlog({ title: 'Test Title 3', author: 'Test Author 3', url: 'http://test3.com' })
      })

      it('they are sorted by most likes first', function() {
        cy.get('.blog-container').eq(0).should('contain', 'Test Title').as('leastLikedBlog')
        cy.get('.blog-container').eq(1).should('contain', 'Test Title 2').as('mostLikedBlog')
        cy.get('.blog-container').eq(2).should('contain', 'Test Title 3').as('moreLikedBlog')

        cy.get('@mostLikedBlog').contains('Show').click()
        cy.get('@mostLikedBlog').contains('Like').click()
        cy.get('@mostLikedBlog').contains('1 likes')
        cy.get('@mostLikedBlog').contains('Like').click()
        cy.get('@mostLikedBlog').contains('2 likes')

        cy.get('@moreLikedBlog').contains('Show').click()
        cy.get('@moreLikedBlog').contains('Like').click()
        cy.get('@moreLikedBlog').contains('1 likes')

        cy.get('.blog-container').eq(0).should('contain', 'Test Title 2')
        cy.get('.blog-container').eq(1).should('contain', 'Test Title 3')
        cy.get('.blog-container').eq(2).should('contain', 'Test Title')
      })
    })
  })
})
