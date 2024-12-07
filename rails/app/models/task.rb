class Task < ApplicationRecord
  belongs_to :user
  enum :status, { unsaved: 10, draft: 20, published: 30 }

  validates :title, :body, presence: true, if: :published?
  validates :end_date, presence: true, comparison: { greater_than: Time.zone.today, message: "は未来の日付を指定してください" }
  validates :completed_date, presence: true, comparison: { equal_to: Time.zone.today, message: "は今日の日付を指定してください" }
  validate :verify_only_one_unsaved_status_is_allowed

  private

    def verify_only_one_unsaved_status_is_allowed
      if unsaved? && user.tasks.unsaved.present?
        raise StandardError, "未保存の記事は複数保有できません"
      end
    end
end
