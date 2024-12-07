class CreateTasks < ActiveRecord::Migration[7.0]
  def change
    create_table :tasks do |t|
      t.string :title, comment: "タイトル"
      t.text :body, comment: "タスク内容"
      t.references :user, null: false, foreign_key: true
      t.date :end_date, comment: "タスクの期限"
      t.date :completed_date, comment: "タスクの達成日"
      t.integer :status, comment: "ステータス（10:未保存, 20:下書き, 30:公開中）"

      t.timestamps
    end
  end
end