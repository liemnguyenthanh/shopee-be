import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo } from './entities/todo.entity';
import { TodoDocument } from './tods.schema';

@Injectable()
export class TodosService {
  constructor(@InjectModel('Todos') private todoModel: Model<TodoDocument>) {}

  async create(todo: Todo): Promise<Todo> {
    if (todo.isCompleted === undefined) todo.isCompleted = false;

    const newTodo = new this.todoModel(todo);
    console.log('new todo:', newTodo);
    return await newTodo.save();
  }
  // filter Params by isCompleted
  async findAll(isCompleted: boolean): Promise<Todo[]> {
    // create filter to find if url has query
    const filter: any = {};
    if (isCompleted) filter.isCompleted = isCompleted;
    return await this.todoModel.find(filter).exec();
  }

  async findOne(id: string): Promise<Todo> {
    // i see my code is not good, we need time to optimize it
    if (!id.match(/^[0-9a-fA-F]{24}$/))
      throw new BadRequestException('Id todo is not validate');

    const todo_exist = await this.todoModel.findOne({ _id: id });
    if (!todo_exist) throw new BadRequestException('Todo is not exist!!');
    return todo_exist;
  }

  async update(id: string, todo: Todo): Promise<string> {
    // something wrong in here
    //actually, I had checked in mongocompassed and it had changed data but i did not know why response return old data!!
    await this.findOne(id);
    await this.todoModel.findByIdAndUpdate(id, todo);
    return 'Update success!!';
  }

  async remove(id: string): Promise<any> {
    await this.findOne(id);
    return await this.todoModel.deleteOne({ _id: id });
  }
}
