class ApiController < ApplicationController
  layout false

  skip_before_filter :verify_authenticity_token
  def list
    file = File.open(Rails.root.join('list.json')).read
    render :json => JSON.parse(file)
  end

end
