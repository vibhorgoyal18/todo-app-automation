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
