Feature: Authentication
  As a user
  I want to log in and out of the application
  So that my data is secure

  Scenario: Successful login
    Given I am on the login page
    When I enter username "user" and password "password"
    And I click the login button
    Then I should be redirected to the dashboard

  Scenario: Failed login with invalid credentials
    Given I am on the login page
    When I enter username "user" and password "wrongpassword"
    And I click the login button
    Then I should see an error message

  Scenario: Logout
    Given I am logged in as "user" with password "password"
    When I click the logout button
    Then I should be redirected to the login page
