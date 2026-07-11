@auth
Feature: Authentication
  As a user
  I want to log in and out of the application
  So that my data is kept secure

  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I enter credentials for user "testuser"
    And I click the Sign In button
    Then I should be redirected to the dashboard
    And I should see the username "Alice Tester" in the header

  Scenario: Failed login with invalid credentials
    Given I am on the login page
    When I enter credentials for user "testuser" with wrong password "wrongpassword"
    And I click the Sign In button
    Then I should see an error "Invalid username or password"

  Scenario: Password visibility toggle
    Given I am on the login page
    When I enter credentials for user "testuser"
    And I toggle the password visibility
    Then the password field should show the password as plain text

  Scenario: Logout
    Given I am logged in as "testuser"
    When I click the Logout button
    Then I should be redirected to the login page

  Scenario: Login fails when username is empty
    Given I am on the login page
    When I click the Sign In button
    Then I should see a field validation error "Username is required"

  Scenario: Login fails when password is empty
    Given I am on the login page
    When I enter only the username for user "testuser"
    And I click the Sign In button
    Then I should see a field validation error "Password is required"

  Scenario: Login fails with unknown username
    Given I am on the login page
    When I enter username "unknownuser" and password "somepassword"
    And I click the Sign In button
    Then I should see an error "Invalid username or password"

  # Intentionally failing — app shows "Alice Tester", not "Alice"
  @failing
  Scenario: Header shows user first name only after login
    Given I am on the login page
    When I enter credentials for user "testuser"
    And I click the Sign In button
    Then the header should display "Alice"
