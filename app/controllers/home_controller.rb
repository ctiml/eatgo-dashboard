class HomeController < ApplicationController
  layout 'home'
  before_action :load_config

  def index
  end

  private

  def load_config
    raw_config = File.read("config/config.yml")
    config = YAML.load(raw_config)
    data = File.read(config[Rails.env]['data'])
    @menu = JSON.parse(data)
  end
end
