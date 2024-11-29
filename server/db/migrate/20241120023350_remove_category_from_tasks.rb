class RemoveCategoryFromTasks < ActiveRecord::Migration[7.0]
  def change
    remove_column :tasks, :category, :string
  end
end
