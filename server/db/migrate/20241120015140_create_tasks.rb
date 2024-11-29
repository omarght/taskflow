class CreateTasks < ActiveRecord::Migration[7.0]
  def change
    create_table :tasks do |t|
      t.string :title
      t.text :description
      t.string :status
      t.datetime :start_date
      t.datetime :due_date
      t.integer :importance
      t.string :category

      t.timestamps
    end
  end
end
