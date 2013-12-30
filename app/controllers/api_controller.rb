class ApiController < ApplicationController
  layout false

  skip_before_filter :verify_authenticity_token
  def list
    unless params.include? :q
      render :nothing => true and return
    end
    q = params[:q]
    file = File.open(Rails.root.join("files/#{q}.json")).read
    render :json => JSON.parse(file)
  end

end
