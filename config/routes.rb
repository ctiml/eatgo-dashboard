EatgoDashboard::Application.routes.draw do
  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }
  #root :to => 'high_voltage/pages#show', :id => 'welcome'
  root :to => 'category#show', :id => 'home'
  
  resources 'api', only: [] do
    collection do
      post :list
      get :list
    end
  end

  resources 'category', only: [:show]

end
