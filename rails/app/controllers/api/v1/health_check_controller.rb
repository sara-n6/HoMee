class Api::V1::HealthCheckController < ApplicationController
  def index
    render json: { message: "Success Health Check!" }, status: :ok
  end
end
# デバックしたら必ずcontinueで抜けてから消すこと
