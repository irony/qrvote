FROM nano/node.js

ADD . /usr/src/app
WORKDIR /usr/src/app
EXPOSE 3000
RUN ["/usr/bin/npm", "install", "--production"]

CMD ["/usr/bin/node", "app.js"]