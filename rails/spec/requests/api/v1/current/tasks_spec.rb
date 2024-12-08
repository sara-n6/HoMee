require "rails_helper"

RSpec.describe "Api::V1::Current::Tasks", type: :request do
  describe "POST api/v1/current/tasks" do
    subject { post(api_v1_current_tasks_path, headers:) }

    let(:headers) { current_user.create_new_auth_token }
    let(:current_user) { create(:user) }

    context "ログインユーザーに紐づく未保存ステータスの記事が0件の時" do
      it "未保存ステータスの記事が新規作成される" do
        expect { subject }.to change { current_user.tasks.count }.by(1)
        expect(current_user.tasks.last).to be_unsaved
        res = JSON.parse(response.body)
        expect(res.keys).to eq ["id", "title", "body", "status", "created_at", "from_today", "user"]
        expect(res["user"].keys).to eq ["name"]
        expect(response).to have_http_status(:ok)
      end
    end

    context "ログインユーザーに紐づく未保存ステータスの記事が1件の時" do
      before { create(:task, user: current_user, status: :unsaved) }

      it "未保存ステータスの記事が新規作成される" do
        expect { subject }.not_to change { current_user.tasks.count }
        res = JSON.parse(response.body)
        expect(res.keys).to eq ["id", "title", "body", "status", "created_at", "from_today", "user"]
        expect(res["user"].keys).to eq ["name"]
        expect(response).to have_http_status(:ok)
      end
    end
  end

  describe "PATCH api/v1/current/tasks" do
    subject { patch(api_v1_current_task_path(id), headers:, params:) }

    let(:headers) { current_user.create_new_auth_token }
    let(:current_user) { create(:user) }
    let(:other_user) { create(:user) }
    let(:params) { { "task": { "title": "テストタイトル2", "body": "テスト本文2", "status": "published" } } }

    context ":id がログインユーザーに紐づく tasks レコードの id である時" do
      let(:current_user_task) { create(:task, title: "テストタイトル1", body: "テスト本文1", status: :draft, user: current_user) }
      let(:id) { current_user_task.id }

      it "正常にレコードを更新できる" do
        expect { subject }.to change { current_user_task.reload.title }.from("テストタイトル1").to("テストタイトル2") and
          change { current_user_task.reload.body }.from("テスト本文1").to("テスト本文2") and
          change { current_user_task.reload.status }.from("draft").to("published")
        res = JSON.parse(response.body)
        expect(res.keys).to eq ["id", "title", "body", "status", "created_at", "from_today", "user"]
        expect(res["user"].keys).to eq ["name"]
        expect(response).to have_http_status(:ok)
      end
    end

    context ":id がログインユーザーに紐づく tasks レコードの id ではない時" do
      let(:other_user_task) { create(:task, user: other_user) }
      let(:id) { other_user_task.id }

      it "例外が発生する" do
        expect { subject }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
end
