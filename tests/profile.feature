@profile
Feature: Profile Management
  As a logged-in user
  I want to manage my profile
  So that I can update my personal information

  Background:
    Given I am logged in
    And I navigate to the Profile page

  Scenario: Update profile name
    When I update the name field to "Alice Updated"
    And I click Save Profile
    Then I should see a success notification

  Scenario: Change password successfully
    When I fill in the current password "Test@1234"
    And I fill in the new password "NewPass@5678"
    And I fill in the confirm password "NewPass@5678"
    And I click Change Password
    Then I should see a password success message

  Scenario: Change password fails when current password is wrong
    When I fill in the current password "WrongPass"
    And I fill in the new password "NewPass@5678"
    And I fill in the confirm password "NewPass@5678"
    And I click Change Password
    Then I should see a password error message

  Scenario: Change password fails when passwords do not match
    When I fill in the current password "Test@1234"
    And I fill in the new password "NewPass@5678"
    And I fill in the confirm password "DifferentPass@9999"
    And I click Change Password
    Then I should see a password error message
