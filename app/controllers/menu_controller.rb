class MenuController < ApplicationController
  layout 'menu'

  def index
    raw_config = File.read("config/config.yml")
    config = YAML.load(raw_config)
    data = File.read(config[Rails.env]['data'])
    @menu = JSON.parse(data)
  end

end
