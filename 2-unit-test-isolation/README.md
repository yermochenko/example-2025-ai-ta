# Пример использования инверсии завсимостей для изоляции модульных тестов

Сервисный класс [`Service`](service/service.js) имеет зависимости от репозиториев.

При запуске [приложения](index.js) объект класса `Service` создаётся с помощью класса
[`ServiceFactory`](service/service-factory.js), при этом объекту класса `Service` внедряются в
качестве зависимостей объекты классов
[`AccountRepositoryDbImpl`](repository/account-repository-db-impl.js) и
[`TransferRepositoryDbImpl`](repository/transfer-repository-db-impl.js).

В то время как при запуске [модульных тестов](test/service-test.js) для методов класса `Service`
при создании объектов этого класса им в качестве зависимостей внедряются объекты классов
[`AccountRepositoryTestImpl`](repository/account-repository-test-impl.js) и
[`TransferRepositoryTestImpl`](repository/transfer-repository-test-impl.js).