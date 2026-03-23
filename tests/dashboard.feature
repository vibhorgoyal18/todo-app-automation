@dashboard @auth:required
Feature: Dashboard
  As a logged-in user
  I want to view my dashboard
  So that I can get an overview of my todos

  Background:
    Given I navigate to the Dashboard page

  Scenario: Dashboard shows correct stats
    Then I should see the stat card "Total Todos" with value "3"
    And I should see the stat card "Completed" with value "1"
    And I should see the stat card "In Progress" with value "1"

  Scenario: Quick Add todo from dashboard
    When I click the Quick Add button
    And I fill in the todo title "Dashboard quick todo"
    And I submit the todo form
    Then I should see the stat card "Total Todos" with value "4"

  Scenario Outline: Clicking <card> card opens a new tab with the correct URL
    When I click the "<card>" stat card
    Then a new tab should open with URL containing "<urlFragment>"
    When I close the new tab

    Examples:
      | card        | urlFragment        |
      | Total Todos | #/todos            |
      | Completed   | status=done        |
      | In Progress | status=in-progress |
      | Overdue     | status=overdue     |
