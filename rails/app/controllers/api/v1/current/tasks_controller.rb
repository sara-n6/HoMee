class Api::V1::Current::TasksController < Api::V1::BaseController
  before_action :authenticate_user!

  def index
    tasks = current_user.tasks.not_unsaved.order(created_at: :desc)
    render json: tasks
  end

  def show
    task = current_user.tasks.find(params[:id])
    render json: task
  end

  def create
    unsaved_task = current_user.tasks.unsaved.first || current_user.tasks.create!(status: :unsaved)
    render json: unsaved_task
  end

  def update
    task = current_user.tasks.find(params[:id])
    task.update!(task_params)
    render json: task
  end

  private

    def task_params
      params.require(:task).permit(:title, :body, :status)
    end
end
