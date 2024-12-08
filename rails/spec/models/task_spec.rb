require "rails_helper"

RSpec.describe Task, type: :model do
  context "factoryのデフォルト設定に従った時" do
    subject { create(:task) }

    it "正常にレコードを新規作成できる" do
      expect { subject }.to change { Task.count }.by(1)
    end

    it "期限が未来の日付である" do
      expect(subject.end_date).to be > Time.zone.today
    end
  end

  describe "Validations" do
    subject { task.valid? }

    let(:task) { build(:task, title:, body:, end_date:, user:, status:) }
    let(:title) { Faker::Lorem.sentence }
    let(:body) { Faker::Lorem.paragraph }
    let(:user) { create(:user) }
    let(:end_date) { Time.zone.today + 7.days } # デフォルトは未来の日付
    let(:completed_date) { Time.zone.today }
    let(:status) { :published }

    context "全ての値が正常な時" do
      it "検証が通る" do
        expect(subject).to be_truthy
      end
    end

    context "ステータスが公開済みかつ、タイトルが空の時" do
      let(:title) { "" }

      it "エラーメッセージが返る" do
        expect(subject).to be_falsy
        expect(task.errors.full_messages).to eq ["タイトルを入力してください"]
      end
    end

    context "ステータスが公開済みかつ、本文が空の時" do
      let(:body) { "" }

      it "エラーメッセージが返る" do
        expect(subject).to be_falsy
        expect(task.errors.full_messages).to eq ["本文を入力してください"]
      end
    end

    context "ステータスが未保存かつ、すでに同一ユーザーが未保存ステータスの記事を所有していた時" do
      let(:status) { :unsaved }
      before { create(:task, status: :unsaved, user:) }

      it "例外が発生する" do
        expect { subject }.to raise_error(StandardError)
      end
    end
  end
end
