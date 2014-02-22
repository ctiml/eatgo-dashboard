class RawController < ApplicationController
  layout 'raw'
  before_action :load_config

  def index
  end

  def show
    id = params[:id]
    redirect_to raw_index_path if id.nil? or id.empty?

    filename = "files/#{id}.json"
    redirect_to raw_path unless File.exists? filename
    raw_file = File.read(filename)

    @id = id
    map = @map[id] if @map.include? id
    @name = map['name'] unless map.nil?
    @parent = map['parent'] unless map.nil?
    begin
      @content = JSON.pretty_generate(JSON.parse(raw_file))
    rescue
      @content = ""
    end
  end

  def edit
    id = params[:id]
    redirect_to raw_index_path if id.nil? or id.empty?

    filename = "files/#{id}.json"
    redirect_to raw_path unless File.exists? filename
    raw_file = File.read(filename)

    @id = id
    map = @map[id] if @map.include? id
    @name = map['name'] unless map.nil?
    @parent = map['parent'] unless map.nil?
    begin
      @content = JSON.pretty_generate(JSON.parse(raw_file))
    rescue
      @content = ""
    end
  end

  def update
    id = params[:id]
    content = params[:content]
    redirect_to raw_index_path if id.nil? or id.empty?

    filename = "files/#{id}.json"
    file = File.open(filename, 'w')
    file.write(content)
    file.close

    redirect_to raw_path(:id => id), flash: { notice_message: '更新成功' }
  end

  def new
    @parent = @menu.collect {|m| [m['name'], m['id']]}
    @parent.unshift(['<無>', nil])
  end

  def create
    id = params[:id]
    name = params[:name]
    parent_id = params[:parent]
    content = params[:content]
    redirect_to raw_index_path if id.nil? or id.empty?
    redirect_to raw_index_path if name.nil? or name.empty?

    if parent_id.empty?
      @menu.push({"id"=>id, "name"=>name})
    else
      @menu.each do |m|
        if m['id'] == parent_id.to_s
          m['items'] = [] unless m.include? 'items'
          m['items'].push({"id"=>id, "name"=>name})
        end
      end
    end
    save_config()

    filename = "files/#{id}.json"
    file = File.open(filename, 'w')
    file.write(content)
    file.close

    redirect_to raw_path(:id => id), flash: { notice_message: '新增成功' }
  end

  def destroy
    id = params[:id]
    redirect_to raw_index_path if id.nil? or id.empty?

    @menu.each do |m|
      next unless m.include? 'items'
      if m['id'] == id
        m['items'].each { |i| File.delete("files/#{i['id']}.json") if File.exists? "files/#{i['id']}.json" }
      else
        m['items'].delete_if {|i| i["id"] == id}
      end
    end

    @menu.delete_if { |m| m["id"] == id }
    save_config()
    File.delete("files/#{id}.json") if File.exists? "files/#{id}.json"

    redirect_to raw_index_path(), flash: { notice_message: "#{@map[id]} 已刪除" }
  end

  private

  def load_config
    raw_config = File.read("config/config.yml")
    config = YAML.load(raw_config)
    data = File.read(config[Rails.env]['data'])
    @menu = JSON.parse(data)
    @map = {}
    @menu.each do |m|
      @map[m['id']] = {'name' => m['name'], 'parent' => ''}
      if m.include? 'items'
        m['items'].each do |i|
          @map[i['id']] = {'name' => i['name'], 'parent' => m['name']}
        end
      end
    end
  end

  def save_config
    content = JSON.pretty_generate(@menu)
    raw_config = File.read("config/config.yml")
    config = YAML.load(raw_config)
    file = File.open(config[Rails.env]['data'], 'w')
    file.write(content)
    file.close
  end
end
