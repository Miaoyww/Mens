// 首次启动时初始化单节点副本集
// docker-entrypoint-initdb.d 会在 MongoDB 首次启动后执行此脚本

try {
  rs.initiate({
    _id: "rs0",
    members: [{ _id: 0, host: "mongo:27017" }]
  });
  print("Replica set rs0 initiated.");
} catch (e) {
  print("rs.initiate() error (可能已初始化): " + e);
}
