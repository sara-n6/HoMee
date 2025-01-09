class ChangeStatusColumnComment < ActiveRecord::Migration[7.0]
  def up
    change_column_comment(:tasks, :status, 'ステータス（10:未保存, 20:保存済）')
  end

  def down
    change_column_comment(:tasks, :status, 'ステータス（10:未保存, 20:下書き, 30:公開中）')
  end
end
