FROM node:14 as base

# This application specific
RUN apt-get update && apt-get install -y openssh-client

# Add a new user to run the application in 
RUN useradd --create-home --shell /bin/bash app

# Directories to run the application
RUN mkdir -p /opt/st/data && \
    chown app: -R /opt/st

# Switch to the working directory
WORKDIR /opt/st

# Switch to the user
USER app

COPY --chown=app package.json package-lock.json tsconfig.json /opt/st/
COPY --chown=app ./src /opt/st/src
COPY --chown=app ./node_modules /opt/st/node_modules

# This could get moved behind a dev env flag, instead we would copy the 
# the modules folder instead
RUN npm run build

# Figure out how to do this, the issue is connecting to private git
#RUN npm install --quiet --production

CMD ["npm", "start"]