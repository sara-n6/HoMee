require "rails_helper"

RSpec.describe "Api::V1::Tasks", type: :request do
  describe "GET api/v1/tasks" do
    subject { get(api_v1_tasks_path(params)) }

    before do
      create_list(:task, 25, status: :published)
      create_list(:task, 8, status: :draft)
    end

    context "page を params で送信しない時" do
      let(:params) { nil }

      it "1ページ目のレコード10件取得できる" do
        subject
        res = JSON.parse(response.body)
        expect(res.keys).to eq ["tasks", "meta"]
        expect(res["tasks"].length).to eq 10
        expect(res["tasks"][0].keys).to eq ["id", "title", "body", "status", "end_date", "created_at", "from_today", "user"]
        expect(res["tasks"][0]["user"].keys).to eq ["name"]
        expect(res["meta"].keys).to eq ["current_page", "total_pages"]
        expect(res["meta"]["current_page"]).to eq 1
        expect(res["meta"]["total_pages"]).to eq 3
        expect(response).to have_http_status(:ok)
      end
    end

    context "page を params で送信した時" do
      let(:params) { { page: 2 } }

      it "該当ページ目のレコード10件取得できる" do
        subject
        res = JSON.parse(response.body)
        expect(res.keys).to eq ["tasks", "meta"]
        expect(res["tasks"].length).to eq 10
        expect(res["tasks"][0].keys).to eq ["id", "title", "body", "status", "end_date", "created_at", "from_today", "user"]
        expect(res["tasks"][0]["user"].keys).to eq ["name"]
        expect(res["meta"].keys).to eq ["current_page", "total_pages"]
        expect(res["meta"]["current_page"]).to eq 2
        expect(res["meta"]["total_pages"]).to eq 3
        expect(response).to have_http_status(:ok)
      end
    end
  end

  describe "GET api/v1/tasks/:id" do
    subject { get(api_v1_task_path(task_id)) }

    let(:task) { create(:task, status:) }

    context "task_id に対応する tasks レコードが存在する時" do
      let(:task_id) { task.id }

      context "tasks レコードのステータスが公開中の時" do
        let(:status) { :published }

        it "正常にレコードを取得できる" do
          subject
          res = JSON.parse(response.body)
          expect(res.keys).to eq ["id", "title", "body", "status", "end_date", "created_at", "from_today", "user"]
          expect(res["user"].keys).to eq ["name"]
          expect(response).to have_http_status(:ok)
        end
      end

      context "tasks レコードのステータスが下書きの時" do
        let(:status) { :draft }

        it "ActiveRecord::RecordNotFound エラーが返る" do
          expect { subject }.to raise_error(ActiveRecord::RecordNotFound)
        end
      end
    end

    context "task_id に対応する tasks レコードが存在しない時" do
      let(:task_id) { 10_000_000_000 }

      it "ActiveRecord::RecordNotFound エラーが返る" do
        expect { subject }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
end
