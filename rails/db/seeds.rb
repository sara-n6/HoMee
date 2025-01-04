ActiveRecord::Base.transaction do
  user1 = User.create!(name: "テスト太郎", email: "test1@example.com", password: "password", confirmed_at: Time.current)

  user2 = User.create!(name: "テスト次郎", email: "test2@example.com", password: "password", confirmed_at: Time.current)

  15.times do |i|
    Task.create!(title: "テストタイトル1-#{i}", body: "テスト本文1-#{i}", status: :saved, user: user1)
    Task.create!(title: "テストタイトル2-#{i}", body: "テスト本文2-#{i}", status: :saved, user: user2)
  end
end
