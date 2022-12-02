<template>
    <v-main class="list">
        <v-card>
            <v-list-item>
                <v-list-item-avatar color="grey"></v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title class="headline">To Do List</v-list-item-title>
                    <v-list-item-subtitle>by 200710588</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" Label="Search" outlined hide details
                    style="margin-top: 30px;"></v-text-field>
                <v-spacer></v-spacer>
                <v-col class="d-flex" cols="12" sm="6">
                    <v-select :items="items" label="Filter" v-on:change="changeRoute"></v-select>
                </v-col>
                <v-btn color="success" dark @click="dialog = true"> Tambah </v-btn>
            </v-card-title>
        </v-card>
        <v-card>
            <v-data-table v-model="selected" :headers="headers" :items="todos" :search="search"
                :expanded.sync="expanded" item-key="note" show-expand :single-select="singleSelect" show-select>
                <template v-slot:[`item.priority`]="{ item }">
                    <v-btn @click="openSnackbar(item)">
                        <v-icon :color="getColor(item.priority)">
                            mdi-alert-octagon
                        </v-icon>
                    </v-btn>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn class="mx-2" fab dark small color="green" @click="editItem(item)">
                        <v-icon dark>
                            mdi-pencil
                        </v-icon>
                    </v-btn>
                    <v-btn class="mx-2" fab dark small color="red" @click="openDelete(item)">
                        <v-icon dark>
                            mdi-delete
                        </v-icon>
                    </v-btn>
                </template>
                <template v-slot:[`expanded-item`]="{ item }">
                    <v-container v-if="item.priority === 'Penting'" style="background-color: red;">
                        <v-chip class="ma-2" :color="getColor(item.priority)" text-color="white">
                            <v-icon left>
                                mdi-fire
                            </v-icon>
                            {{ item.priority }}
                        </v-chip>
                        <v-chip class="ma-2" color="yellow" text-color="white">
                            <v-icon left>
                                mdi-note
                            </v-icon>
                            {{ item.note }}
                        </v-chip>
                    </v-container>
                    <v-container v-if="item.priority === 'Biasa'" style="background-color: blue;">
                        <v-chip class="ma-2" :color="getColor(item.priority)" text-color="white">
                            <v-icon left>
                                mdi-fire
                            </v-icon>
                            {{ item.priority }}
                        </v-chip>
                        <v-chip class="ma-2" color="yellow" text-color="white">
                            <v-icon left>
                                mdi-note
                            </v-icon>
                            {{ item.note }}
                        </v-chip>
                    </v-container>
                    <v-container v-if="item.priority === 'Tidak Penting'" style="background-color: green;">
                        <v-chip class="ma-2" :color="getColor(item.priority)" text-color="white">
                            <v-icon left>
                                mdi-fire
                            </v-icon>
                            {{ item.priority }}
                        </v-chip>
                        <v-chip class="ma-2" color="yellow" text-color="white">
                            <v-icon left>
                                mdi-note
                            </v-icon>
                            {{ item.note }}
                        </v-chip>
                    </v-container>
                </template>
            </v-data-table>
        </v-card>
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline"> Form Todo List </span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="formTodo.task" Label="Task" required></v-text-field>
                        <v-select v-model="formTodo.priority" :items="[`Penting`, `Biasa`, `Tidak Penting`]"
                            Label="Priority" required></v-select>

                        <v-textarea v-model="formTodo.note" Label="Note" required></v-textarea>
                        <v-select v-model="formTodo.status" :items="[`Selesai`, `Belum Selesai`]" Label="Status"
                            required></v-select>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel"> Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="save"> Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogEdit" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline"> Form Todo List Edit </span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="formTodo.task" Label="Task" required></v-text-field>
                        <v-select v-model="formTodo.priority" :items="[`Penting`, `Biasa`, `Tidak Penting`]"
                            Label="Priority" required></v-select>

                        <v-textarea v-model="formTodo.note" Label="Note" required></v-textarea>
                        <v-select v-model="formTodo.status" :items="[`Selesai`, `Belum Selesai`]" Label="Status"
                            required></v-select>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancelEdit"> Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="saveEdit"> Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" persistent max-width="290">
            <template v-slot:activator="{ }">
            </template>
            <v-card>
                <v-card-title class="text-h5">
                    Are you sure to delete?
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="dialogDelete = false">
                        cancel
                    </v-btn>
                    <v-btn color="red darken-1" text @click="deleteItem()">
                        Delete
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar v-model="snackbar" :timeout="timeout" :color="getColor(tempPriority)"
            v-if="tempPriority === 'Penting'" right top>
            <v-icon left>
                mdi-alarm
            </v-icon>
            Notes Priority : {{ tempPriority }}
        </v-snackbar>
        <v-snackbar v-model="snackbar" :timeout="timeout" :color="getColor(tempPriority)"
            v-if="tempPriority === 'Tidak Penting'">
            <v-icon left>
                mdi-heart
            </v-icon>
            Notes Priority : {{ tempPriority }}
        </v-snackbar>
        <v-snackbar v-model="snackbar" :timeout="timeout" :color="getColor(tempPriority)"
            v-if="tempPriority === 'Biasa'" left top>
            <v-icon left>
                mdi-pause
            </v-icon>
            Notes Priority : {{ tempPriority }}
        </v-snackbar>
        <!-- <h1>{{ selected }}</h1> -->
        <div v-if="selected.length > 0">
            <h3>Delete Multiple</h3>
            <li v-for="item in selected" v-bind:key="item">
                {{ item.task }}
            </li>
            <v-btn color="error" dark @click="deleteAll"> HAPUS SEMUA </v-btn>
        </div>
    </v-main>
</template>
<script>
export default {
    name: "ListItem",
    data() {
        return {
            tempAllTodos: [],
            singleSelect: false,
            selected: [],
            tempPriority: "",
            editItemnya: {},
            indexnya: 0,
            indexnyaEdit: 0,
            search: null,
            filter: "",
            dialog: false,
            dialogEdit: false,
            dialogDelete: false,
            snackbar: false,
            timeout: 2000,
            items: ['All', 'Penting', 'Tidak Penting'],
            headers: [
                {
                    text: "task",
                    align: "start",
                    sortable: true,
                    value: "task"
                },
                { text: "Priority", value: "priority" },
                { text: "Note", value: "note" },
                { text: "Status", value: "status" },
                { text: "Actions", value: "actions" },
            ],
            todos: [
                {
                    task: "Coding",
                    priority: "Penting",
                    note: "Code for your life",
                    status: "Belum Selesai"
                },
                {
                    task: "Cooking",
                    priority: "Biasa",
                    note: "Indomie saat begadang ngerjain coding terbaek",
                    status: "Selesai"
                },
                {
                    task: "Gaming",
                    priority: "Tidak Penting",
                    note: "Wasting Time",
                    status: "Belum Selesai"
                },
            ],
            formTodo: {
                task: null,
                priority: null,
                note: null,
                status: null,
            }
        }
    },
    methods: {
        save() {
            this.todos.push(this.formTodo);
            this.resetForm()
            this.dialog = false
        },
        deleteAll() {
            let tempU = []
            let tempI = []
            for (let u = 0; u < this.todos.length; u++) {
                tempU.push(u)
            }
            for (let i = 0; i < this.todos.length; i++) {
                for (let j = 0; j < this.selected.length; j++) {
                    if (this.todos[i].task === this.selected[j].task) {
                        tempI.push(this.todos[i].task)
                    }
                }
            }
            let a = this.todos.filter(item => !tempI.includes(item.task));
            this.todos = a
            this.selected = []
        },
        openDelete(item) {
            this.dialogDelete = true
            for (let i = 0; i < this.todos.length; i++) {
                if (this.todos[i].task === item.task) {
                    this.indexnya = i
                }
            }
        },
        deleteItem() {
            this.todos.splice(this.indexnya, 1);
            this.dialogDelete = false
        },
        editItem(item) {
            this.dialogEdit = true
            this.formTodo.task = item.task
            this.formTodo.priority = item.priority
            this.formTodo.note = item.note
            this.formTodo.status = item.status
            this.editItemnya = item
        },
        saveEdit() {
            this.editItemnya.task = this.formTodo.task
            this.editItemnya.priority = this.formTodo.priority
            this.editItemnya.note = this.formTodo.note
            this.editItemnya.status = this.formTodo.status
            this.dialogEdit = false
        },
        cancel() {
            this.resetForm()
            this.dialog = false
        },
        cancelEdit() {
            this.resetForm()
            this.dialogEdit = false
        },
        resetForm() {
            this.formTodo = {
                task: null,
                priority: null,
                note: null,
                status: null,
            }
        },
        getColor(prior) {
            if (prior === "Penting") return 'red'
            else if (prior === "Tidak Penting") return 'blue'
            else return 'green'
        },
        openSnackbar(item) {
            this.tempPriority = item.priority
            this.snackbar = true
        },
        changeRoute(a) {
            if(a === "All") {
                this.tempAllTodos = this.todos
            }
            if (a === "Penting" || a === "Tidak Penting") {
                let tempTodos = this.todos.filter(item => a === item.priority);
                this.todos = tempTodos
            }
        }
    }
}
</script>
<style>
.text {
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    font-size: 40px;
    font-style: italic;
}
</style>
