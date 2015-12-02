require 'rails_helper'

describe API::V1::User do
  context 'as admin user' do 
    let!(:user) { FactoryGirl.create(:user) }
    let!(:group) { FactoryGirl.create(:admin_group) }

    before :each do 
      group.users << user
      stub_authenticate!(user)
    end

    it 'get user navbar' do
      root = FactoryGirl.create(:sidebar, name: 'root')
      dashboard = FactoryGirl.create(:sidebar, name: 'dashboard', parent: root)
      navbar1 = FactoryGirl.create(:sidebar, name: 'dashboard', parent: dashboard)

      group.roles.first.sidebars << [dashboard, navbar1]

      get "/api/v1/user/#{user.id}/ui?type=sidebars"

        expect(response).to be_success
      expect(response.body).to eq(group.get_func_by_role('sidebars').to_json)
    end

    context 'update user profile' do
      it 'put user info with right info' do
        put "/api/v1/user/#{user.id}", { username: "#{user.username}1" }

        user.reload

        expect(response).to be_success
        expect(response.body).to eq(user.get_data('summary').to_json)
      end

      it 'put user info with wrong password' do
        put "/api/v1/user/#{user.id}", { username: 'Admin1', email: 'admin@example.com', password: '1', password_confirmation: '1' }

        expect(response).to have_http_status(400)
        expect(response.body).to eq({
          status: 400,
          message: "Can't update user profile.",
          errors: { password: ["is too short (minimum is 8 characters)"] }
        }.to_json)
      end
    end

    context 'get user notifications' do
      it 'with valid quantity' do 
        get "/api/v1/user/#{user.id}/notifications?quantity=5"

        expect(response.body).to eq(user.mailbox.notifications.first(5).to_json)
      end

      it 'with invalid quantity' do

        get "/api/v1/user/#{user.id}/notifications?quantity=-1"

        expect(response.body).to eq({
          status: 400,
          message: 'Invalid params',
          errors: ['Wrong quantity param']
        }.to_json)
      end

      it 'by valid page' do
        get "/api/v1/user/#{user.id}/notifications?page=1"

        expect(response.body).to eq(user.mailbox.notifications.page(1).per(25).to_json)
      end

      it 'by invalid page' do
        get "/api/v1/user/#{user.id}/notifications?page=-1"

        expect(response.body).to eq({
          status: 400,
          message: 'Invalid params',
          errors: ['Wrong page param']
        }.to_json)
      end
    end
  end
end
