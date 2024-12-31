class Api::V1::Current::TasksController < Api::V1::BaseController
  before_action :authenticate_user!

  def index
    tasks = current_user.tasks.not_unsaved
    if params[:state].present?
      case params[:state]
      when "in_progress"
        tasks = tasks.where(completed_date: nil)
      end
    end
    tasks = tasks.order(created_at: :desc)
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

  def batch_complete
    tasks = current_user.tasks.where(id: params[:task_ids])
    # rubocop:disable Rails::SkipsModelValidations
    tasks.update_all(completed_date: Time.current, updated_at: Time.current)
    # rubocop:enable Rails::SkipsModelValidations
    head :no_content
  end

  def destroy
    task = current_user.tasks.find(params[:id])
    task.destroy!
    head :no_content
  end

  private

    def task_params
      params.require(:task).permit(:title, :body, :status, :end_date)
    end
end
