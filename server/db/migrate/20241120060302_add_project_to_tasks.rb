class AddProjectToTasks < ActiveRecord::Migration[7.0]
  def change
    add_reference :tasks, :project, null: true, foreign_key: true
  end
end
