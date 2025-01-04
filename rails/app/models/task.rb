class Task < ApplicationRecord
  belongs_to :user
  enum :status, { unsaved: 10, saved: 20 }

  validates :title, :body, presence: true, if: :saved?
  validate :verify_only_one_unsaved_status_is_allowed

  private

    def verify_only_one_unsaved_status_is_allowed
      if unsaved? && user.tasks.unsaved.present?
        raise StandardError, "未保存の場合は複数保有できません"
      end
    end
end
