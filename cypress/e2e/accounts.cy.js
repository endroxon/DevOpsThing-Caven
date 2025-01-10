describe('Account Management Frontend', () => {
  let baseUrl;

  before(() => {
    cy.task('startServer').then((url) => {
      baseUrl = url;
      cy.visit(baseUrl);
    });
  });

  after(() => {
    return cy.task('stopServer');
  });

  it('should add a new account', () => {

    cy.get('button[data-target="#accountModal"]').click();
    cy.get('#username').type('cavencavencaven', { force: true });
    cy.get('#password').type('password1', { force: true });
    cy.get('#confirmpassword').type('password1', { force: true });
    cy.get('#email').type('cavencaven@gmail.com', { force: true });

    cy.get('button.btn-primary').contains('Add New Account').click({ force: true });

    cy.get('#tableContent').contains('Test Resource').should('exist');

  });

  it('should view all accounts', () => {
    cy.visit(baseUrl);

    cy.get('#tableContent').contains('Test Resource').should('exist');
  });
  it('should open the modal when the button is clicked', () => {
    cy.visit(baseUrl);

    cy.get('button[data-target="#accountModal"]').click();
  });
  it('should have empty form fields when opening new form', () => {
    cy.visit(baseUrl);


    cy.get('button[data-target="#accountModal"]').click();
    cy.get('#username').should('have.value', '');
    cy.get('#password').should('have.value', '');
    cy.get('#confirmpassword').should('have.value', '');
    cy.get('#email').should('have.value', '');
  });

  it('should accept input in the username field', () => {
    cy.visit(baseUrl);

    cy.get('button[data-target="#accountModal"]').click();
    cy.get('#username').type('testuser');
    cy.get('#username').should('have.value', 'testuser');
  });
  it('should hide input in the password and confirmpassword field', () => {
    cy.visit(baseUrl);


    cy.get('button[data-target="#accountModal"]').click();
    cy.get('#password').type('password1234');
    cy.get('#confirmpassword').type('password1234');
    cy.get('#password').should('have.attr', 'type', 'password');
    cy.get('#confirmpassword').should('have.attr', 'type', 'password');
  });
  it('should not create account when any of the form fields are empty', () => {
    cy.visit(baseUrl);


    cy.get('button[data-target="#accountModal"]').click();
    cy.get('button.btn-primary').contains('Add New Account').click({ force: true });
  });

  it('should show error message when username input is missing', () => {
    cy.visit(baseUrl);


    cy.get('button[data-target="#accountModal"]').click();
    cy.get('#password').type('password1234');
    cy.get('#confirmpassword').type('password1234');
    cy.get('#email').type('cavenusertest@gmail.com');
    cy.get('button.btn-primary').contains('Add New Account').click({ force: true });
    cy.get('#message').should('contain.text', 'All fields are required!');
  });
  it('should show error message when email is missing', () => {
    cy.visit(baseUrl);

    cy.get('button[data-target="#accountModal"]').click();


    cy.get('#username').type('testuser678');
    cy.get('#password').type('password12345');
    cy.get('#confirmpassword').type('password12345');
    cy.get('button.btn-primary').contains('Add New Account').click({ force: true });
    cy.get('#message').should('contain.text', 'Unable to add account!');
  });
  it('should show error message when password input is missing', () => {
    cy.visit(baseUrl);


    cy.get('button[data-target="#accountModal"]').click();
    cy.get('#username').type('caventestuser');
    cy.get('#confirmpassword').type('password12345');
    cy.get('#email').type('cavenusertest@gmail.com');
    cy.get('button.btn-primary').contains('Add New Account').click({ force: true });
    cy.get('#message').should('contain.text', 'All fields are required!');
  });
  it('should show error message when confirm password input is missing', () => {
    cy.visit(baseUrl);

    cy.get('button[data-target="#accountModal"]').click();
    cy.get('#username').type('caventestuser');
    cy.get('#password').type('password123');
    cy.get('#email').type('testuser1234@gmail.com');
    cy.get('button.btn-primary').contains('Add New Account').click({ force: true });
    cy.get('#message').should('contain.text', 'All fields are required!');
  });
  it('should show error message when passwords does not match', () => {
    cy.visit(baseUrl);
    
 
    cy.get('button[data-target="#accountModal"]').click();
    
  
    cy.get('#username').type('testinguser12345');
    cy.get('#password').type('password123');
    cy.get('#confirmpassword').type('password456'); 
    cy.get('#email').type('testuser12341@gmail.com');
    
  
    cy.get('button.btn-primary').contains('Add New Account').click({ force: true });
    cy.get('#message').should('contain.text', 'Unable to add account!');
  });  
});
