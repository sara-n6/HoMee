FactoryBot.define do
  factory :task do
    user
    title { Faker::Lorem.sentence }
    body { Faker::Lorem.paragraph }
    end_date { Faker::Date.forward(days: 7) } # 現在から7日後のランダムな日付
    completed_date { Time.zone.today } # 今日の日付
    status { :saved }
  end
end
