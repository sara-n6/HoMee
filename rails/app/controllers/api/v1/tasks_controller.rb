class Api::V1::TasksController < Api::V1::BaseController
  include Pagination

  def index
    tasks = Task.saved.order(created_at: :desc).page(params[:page] || 1).per(10).includes(:user)
    render json: tasks, meta: pagination(tasks), adapter: :json
  end

  def show
    task = Task.saved.find(params[:id])
    render json: task
  end
end
