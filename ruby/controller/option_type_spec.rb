require 'rails_helper'

describe API::V1::Inventory::OptionType do
  context 'as admin user' do 
    let!(:user) { FactoryGirl.create(:user) }
    let!(:base_url) { '/api/v1/inventory/option_type' }
    let!(:option_type) { FactoryGirl.create(:option_type, company_id: user.company_id) }
    let!(:option_types) { FactoryGirl.create_list(:option_type, 10, company_id: user.company_id) }

    before :each do 
      stub_authenticate!(user)
    end

    context 'list option type' do

      it 'get list by page and per' do 
        get "#{base_url}s", { page: 1, per: 10 }

        expect(response).to be_success
        expect(JSON.parse(response.body).length).to eq(10)
      end

      it 'get total count' do
        get "#{base_url}s/total"

        expect(response).to be_success
        expect(response.body).to eq('11')
      end

      it 'can export excel' do

      end

      it 'can update through excel file' do
      end
    end

    it 'can create option type' do
      expect { post base_url, FactoryGirl.attributes_for(:option_type) }.to change(Inventory::OptionType, :count).by(1) 
      expect(response).to be_success
    end

    it "can't create invalid option type" do
      post base_url, option_type.to_param 
      expect(response).to have_http_status(400)
    end

    it 'can update option type' do
      put "#{base_url}/#{option_type.id}", { name: 'changed', presentation: 'changed' }

      option_type.reload

      expect(response).to be_success
      expect(option_type.name).to eq('changed')
      expect(option_type.presentation).to eq('changed')
    end

    it 'can delete option type' do
      expect { delete "#{base_url}/#{option_type.id}" }.to change(Inventory::OptionType, :count).by(-1) 
      expect(response).to be_success
    end

    it 'can delete a lot of option types at a time' do
      expect { delete "#{base_url}s", { ids: option_types.first(2).map(&:id).join(',') } }.to change(Inventory::OptionType, :count).by(-2)
      expect(response).to be_success
    end

  end
end
