## Getting file changes from git
git checkout prod

changes=$(git diff --name-only HEAD @{u})

## Pull the latest changes
git pull

if [ $? -ne 0 ]; then
    echo "Error: Unable to pull latest changes from github"
    exit 1
fi


## Pull latest docker images
docker compose -f docker-compose.prod.yml pull

if [ $? -ne 0 ]; then
    echo "Error: Docker Compose pull failed"
    exit 1
fi


## Restart the services
docker compose -f docker-compose.prod.yml up -d

if [ $? -ne 0 ]; then
    echo "Error: Docker Compose run failed"
    exit 1
fi



## Check if there are changes in the scripts folder
if echo "$changes" | grep -q "^scripts/$"; then
  echo "Scripts folder has been changed"
  
  ## Run the deploy script
  ./scripts/deploy.sh
  exit 0
else
  echo "Scripts folder has not been changed"
fi

## Check if there are changes in the database schema
if echo "$changes" | grep -q "^prisma/schema.prisma$"; then
  echo "Database schema has been changed"
  
  ## Run the database migration script
  # Execute the command and redirect stdin from /dev/null to prevent it from waiting for user input
  timeout 60s docker compose exec app sh -c "npm run db:push" < /dev/null

  # Check the exit status of the command
  if [ $? -ne 0 ]; then
    echo "Error: Please manually migrate the Database by logging into the server"
    exit 1
  else 
    echo "Database schema has been migrated successfully"
  fi
else
  echo "Database schema has not been changed"
fi

echo "Deployment completed successfully 🚀"