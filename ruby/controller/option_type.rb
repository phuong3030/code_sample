module API
  module V1
    module Inventory
      class OptionType < Grape::API

        include API::V1::Defaults
        include Grape::Rails::Cache
        helpers API::Auth

        before do
          authenticated_user
        end

        namespace :inventory do
          resource :option_types do
            desc 'Get list option types'
            get '/' do
              current_user.option_types_by_page(params[:page], params[:per])
            end

            desc 'delete multiple records'
            delete '/' do
              current_user.option_types.where(id: params[:ids].split(',')).delete_all
            end

            desc 'Get total of option types to calculate the page number'
            get '/total' do
              current_user.option_types.count
            end

            desc 'export to xls type'
            get '/export' do
            end

            desc 'import records from xls to db'
            post '/import' do
            end
          end

          resource :option_type do
            desc 'Get option type by id'
            get '/:id' do
            end

            desc 'Create new option type'
            post '/' do
              option_type = current_user.option_types.new(option_type_params)

              if option_type.save
                option_type
              else
                error!({ 
                  status: 400,
                  message: "Can't create new option type.",
                  errors: option_type.errors
                }, 400)
              end
            end

            desc 'Update option type'
            put '/:id' do
              option_type = get_option_type

              if option_type && option_type.update_attributes(option_type_params)
                option_type
              else
                error!({ 
                  status: 400,
                  message: "Can't update option type.",
                  errors: option_type.errors
                }, 400)
              end
            end

            desc 'Delete option type'
            delete '/:id' do
              get_option_type.destroy
            end
          end
        end

        helpers do
          def option_type_params
            ActionController::Parameters.new(params).permit(
              :name,
              :presentation,
              :position
            )
          end

          def get_option_type
            current_user.option_types.find(params[:id])
          end
        end
      end
    end
  end
end
