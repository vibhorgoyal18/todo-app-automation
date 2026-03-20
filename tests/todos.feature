Feature: Todo Management
  As a user
  I want to manage my todos
  So that I can track my tasks

  Background:
    Given I am logged in as "user" with password "password"
    And I navigate to the todos page

  Scenario: Add a new todo
    When I add a todo with title "Buy groceries"
    Then I should see "Buy groceries" in the todo list

  Scenario: Complete a todo
    Given there is a todo "Read a book"
    When I check the todo "Read a book"
    Then the todo "Read a book" should be marked as completed

  Scenario: Delete a todo
    Given there is a todo "Old task"
    When I delete the todo "Old task"
    Then I should not see "Old task" in the todo list

  Scenario: Filter todos by status
    Given there is a todo "Completed task" that is completed
    And there is a todo "Pending task" that is pending
    When I filter todos by "completed"
    Then I should see "Completed task" in the todo list
    And I should not see "Pending task" in the todo list
